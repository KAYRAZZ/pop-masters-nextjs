"use client"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from 'next/link';


const Navbar = () => {
    const router = useRouter()

    const handleSearch = (event) => {
        let input = document.querySelector('.inputSearchBar');
        if ((event.key === 'Enter' || event.type === 'click') && input.value && blocRef.current.classList.contains("active")) {
            router.push("/search/?s=" + input.value);
        }
        if (input) {
            setTimeout(() => {
                input.focus();
            }, 0);
        }
    }

    const [blocVisible, setBlocVisible] = useState(false);
    const blocRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if ((blocRef.current && !blocRef.current.contains(e.target)) || e.key === 'Escape') {
                setBlocVisible(false);
            } else {
                setBlocVisible(true);
            }
        };
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleClickOutside);

        };
    }, []);

    return (
        <div id="navbar">
            <span onClick={() => router.push("/")}>POP Masters</span>

            <div ref={blocRef} className={`bloc-searchBar ${blocVisible ? 'active' : ''}`}>
                <input className="inputSearchBar" type="text" placeholder="Figurine | Référence ..." onKeyDown={handleSearch} />
                <img src="/assets/searchicon.png" onClick={handleSearch} />
            </div>

            <nav>
                <li><Link href="/">POP !</Link ></li>
                <li><Link href="/mycollection">Ma Collection</Link ></li>
                <li><Link href="/collections">Les Collections</Link ></li>
                <li><Link href="/wish">Souhaits</Link ></li>
            </nav>
        </div>
    );
};

export default Navbar;