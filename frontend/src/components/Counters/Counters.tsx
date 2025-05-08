"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { FaUsers, FaSmile, FaShippingFast, FaStore } from "react-icons/fa";
import styles from "./Counters.module.css";

interface CounterData {
  id: number;
  icon: JSX.Element;
  title: string;
  suffix: string;
  initialCount: number;
  increment: number;
}

const COUNTER_STORAGE_KEY = "countersData";

const countersConfig: CounterData[] = [
  {
    id: 1,
    icon: <FaUsers />,
    title: "Clientes Atendidos",
    suffix: "+",
    initialCount: 6000,
    increment: 5,
  },
  {
    id: 2,
    icon: <FaSmile />,
    title: "Clientes Satisfechos",
    suffix: "+",
    initialCount: 5000,
    increment: 3,
  },
  {
    id: 3,
    icon: <FaShippingFast />,
    title: "Envíos Realizados",
    suffix: "+",
    initialCount: 4000,
    increment: 10,
  },
  {
    id: 4,
    icon: <FaStore />,
    title: "Tiendas Asociadas",
    suffix: "+",
    initialCount: 100,
    increment: 1,
  },
];

const Counters = () => {
  const [counts, setCounts] = useState<number[]>(
    countersConfig.map((counter) => counter.initialCount)
  );
  const [isVisible, setIsVisible] = useState(false);
  const countersRef = useRef<HTMLDivElement>(null);

  // Cargar valores desde localStorage al montar el componente
  useEffect(() => {
    const storedData = localStorage.getItem(COUNTER_STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as number[];
        if (Array.isArray(parsedData) && parsedData.length === countersConfig.length) {
          setCounts(parsedData);
        }
      } catch (error) {
        console.error("Error al parsear los datos de localStorage:", error);
      }
    }
  }, []);

  // Guardar valores en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem(COUNTER_STORAGE_KEY, JSON.stringify(counts));
  }, [counts]);

  // Incrementar contadores cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prevCounts) =>
        prevCounts.map((count, index) => count + countersConfig[index].increment)
      );
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, []);

  // Observar visibilidad del componente
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = countersRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section className={`section ${styles.counters}`}>
      <div className="container">
        <div ref={countersRef} className={styles.countersGrid}>
          {countersConfig.map((counter, index) => (
            <div key={counter.id} className={styles.counterItem}>
              <div className={styles.counterIcon}>{counter.icon}</div>
              <div className={styles.counterNumber}>
                {isVisible ? (
                  <CountUp
                    start={counts[index] - counter.increment}
                    end={counts[index]}
                    duration={2.5}
                    separator=","
                    suffix={counter.suffix}
                  />
                ) : (
                  counts[index].toLocaleString() + counter.suffix
                )}
              </div>
              <h3 className={styles.counterTitle}>{counter.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counters;
