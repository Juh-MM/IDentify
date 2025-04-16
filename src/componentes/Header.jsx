import style from './Header.module.css';
import identify from '../assets/identify.svg';

export function Header() {
    return(
        <header>
            <img src={identify} alt="logo"/>
        </header>
    )
}