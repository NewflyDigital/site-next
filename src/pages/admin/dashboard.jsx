import Admin from "../../components/admin";
import styles from "../../styles/admin/Dashboard.module.css";

const Content = () => {
  return (
    <section className={styles.root}>
      <h2>Área Administrativa</h2>
      <span>Seja bem vindo!</span>
    </section>
  );
};

export default function Dashboard () {
  return (
    <Admin>
      <Content />
    </Admin>
  );
}
