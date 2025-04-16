import "../global.css";
import style from './MenuLateral.module.css';


export function MenuLateral() {
    return(
        <div className={styles.MenuLateral}>
            <a href="#"><img src="css/img/home.png" className={styles.icone} alt="Início"/>Início</a>
            <a href="#"><img src="css/img/file.png" className={styles.icone} alt="Caso Novo"/>Caso Novo</a>
            <a href="#"><img src="css/img/folder.png" className={styles.icone} alt="Projetos"/>Casos</a>
        </div>
    )
}