import { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate()
    const handleNavigateHome = () => {
        navigate("/");
        navigate(0);
    };

    const handleSearch = (event) => {
        let input = document.querySelector('.inputSearchBar');
        if ((event.key === 'Enter' || event.type === 'click') && input.value && blocRef.current.classList.contains("active")) {
            navigate("/search/?s=" + input.value);
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
            <span onClick={handleNavigateHome}>POP Masters</span>

            <div ref={blocRef} className={`bloc-searchBar ${blocVisible ? 'active' : ''}`}>
                <input className="inputSearchBar" type="text" placeholder="Figurine | Référence ..." onKeyDown={handleSearch} />
                <img src="/assets/searchicon.png" onClick={handleSearch} />
            </div>

            <nav>
                <li><NavLink to="">POP !</NavLink></li>
                <li><NavLink to="mycollection">Ma Collection</NavLink></li>
                <li><NavLink to="collections">Les Collections</NavLink></li>
                <li><NavLink to="wish">Souhaits</NavLink></li>
            </nav>
        </div>
    );
};

export default Navbar;