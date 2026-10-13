import styles from "../styles/WhatsApp.module.css";
import Link from "next/link";

function Whats() {
  return (
    <div className={styles.background}>
      <Link legacyBehavior href="https://api.whatsapp.com/send?phone=">
        <a target="_blank">
          <img src="/whatsapp.png" alt="Whats App" />
        </a>
      </Link>
    </div>
  );
}

export default Whats;
