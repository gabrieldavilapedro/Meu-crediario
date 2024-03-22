import Clientes from "./componentes/Clientes.client";
import styles from './styles/styles.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <Clientes />
      </div>
    </main>
  );
}
