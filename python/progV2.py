import requests
from bs4 import BeautifulSoup
import json
import time
import concurrent.futures
from fake_useragent import UserAgent
import re


url = 'https://figurines-pop.com/collections'

# Ajoutez un User-Agent à la requête pour simuler une requête de navigateur
# headers = {
#     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
headers = {'User-Agent': UserAgent().random}

blocks_analyzed = 0  # Variable partagée pour le nombre de blocs analysés

# Utilisez une session pour gérer les cookies et les sessions entre les requêtes
with requests.Session() as session:
    try:
        # Envoyer une requête pour obtenir le contenu de la page
        response = session.get(url, headers=headers)

        # Vérifier si la requête a réussi (code 200)
        if response.status_code == 200:
            # print("Accès au site principal réussi")

            # Utiliser BeautifulSoup pour analyser le contenu de la page
            soup = BeautifulSoup(response.text, 'html.parser')

            allLinks = []
            for link in soup.find_all('div', class_='card-collection'):
                allLinks.append("https:" + link.find_parent('a').get('href'))

            tailleCollection = len(soup.find_all(
                'div', class_='card-collection'))

            data_list = []

            # Pour avoir l'index
            def analyze_block(link):
                global blocks_analyzed
                while True:
                    try:
                        response = session.get(link, headers=headers)
                        if response.status_code == 200:
                            page_soup = BeautifulSoup(
                                response.text, 'html.parser')
                            datas = []
                            collection = ""
                            name = ""
                            image = ""
                            reference = ""
                            numPop = ""
                            specialFeature = ""
                            for item in page_soup.find_all('div', class_='card-item'):
                                # Récupère ce le 1er élément du bloc
                                name = item.find(
                                    'h3', class_='card-title').contents[0].strip().replace("Figurine POP ", "")

                                image = "https:" + str(item.find(
                                    'img', class_='card-img-top').get("src"))

                                collection = item.find(
                                    'h3', class_='card-title').find("small").text.strip()

                                figurineLink = "https:" + \
                                    item.find('a').get(
                                        "href").replace('\n', '')

                                # Expression pour chercher une séquence de chiffres à la fin de l'URL
                                idUrl = re.search(r'(\d+)$', figurineLink)
                                if idUrl:
                                    figurine_id = int(idUrl.group(1))
                                else:
                                    figurine_id = "N/A"

                                response_figurine = session.get(
                                    figurineLink, headers=headers)
                                if response_figurine.status_code == 200:
                                    figurine_soup = BeautifulSoup(
                                        response_figurine.text, 'html.parser')
                                    reference = figurine_soup.find(
                                        'td', {'itemprop': 'gtin13'})
                                    if reference:
                                        reference = reference.text.strip()
                                    else:
                                        reference = "N/A"

                                    numPop = figurine_soup.find(
                                        'td', {'itemprop': 'sku'})
                                    if numPop:
                                        numPop = numPop.text.strip()
                                    else:
                                        numPop = "N/A"

                                    specialFeature = figurine_soup.find(
                                        'span', class_='bg-info')
                                    if specialFeature:
                                        specialFeature = specialFeature.text.strip()
                                    else:
                                        specialFeature = "N/A"

                                    figurineBox = figurine_soup.find(lambda tag: tag.name == 'small' and (
                                        "Figurine Funko POP "+name+" dans sa boîte") in tag.text)
                                    if figurineBox:
                                        figurineBox = figurineBox.parent.parent.find(
                                            'img').get("src")
                                        figurineBox = "https:"+figurineBox
                                    else:
                                        figurineBox = image

                                else:
                                    print(
                                        f"Erreur pour atteindre la page d'une figurine: \n- Figurine: {name} \n- Catégorie: {collection} \n- Page: {figurineLink} \n- Code: {response_figurine.status_code}")

                                datas.append(
                                    {"figurine_id": figurine_id, "numPop": numPop, "name": name, "figurineImage": image, "figurineBox": figurineBox, "reference": reference, "specialFeature": specialFeature})
                            # Ajouter les données à la liste
                            data_list.append(
                                {"collection": collection, "datas": datas})

                            blocks_analyzed += 1  # Incrémenter le nombre de blocs analysés
                            print(
                                f"Progression: {blocks_analyzed}/{tailleCollection}", end='\r')
                        else:
                            print("Erreur de récup de données pour une catégorie")
                        break

                    except Exception as e:
                        print("----------------")
                        print(f"Une erreur s'est produite : {e}")
                        # print(f"Catégorie: {collection}")
                        # print(f"Nom: {name}")
                        # print(f"Image: {image}")
                        # print(f"Numero catégorie: {index}")
                        print(f"Lien: {link}")
                        # print(f"Code: {response.status_code}")
                        # Attendez un moment avant de réessayer (éviter la surcharge)
                        time.sleep(2)

            with concurrent.futures.ThreadPoolExecutor() as executor:
                results = list(executor.map(analyze_block, allLinks))

            # Écrire les données dans un fichier CSV
            with open('funko_pop_dataV2.json', 'w', encoding='utf-8') as json_file:
                json.dump(data_list, json_file, ensure_ascii=False, indent=2)

            # print(f"\n{nbFigurine} figurines enregistrées")

        else:
            print(
                f"Accès au site échoué avec le code {response.status_code}.")

    except requests.exceptions.ConnectionError as ce:
        print(f"Erreur de connexion : {ce}")
