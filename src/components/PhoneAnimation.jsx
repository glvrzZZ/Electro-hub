import React from 'react';

export default function PhoneAnimation() {
  return (
    <div style={styles.container}>
      <div style={styles.phoneContainer}>
        <img src="https://img.icons8.com/ios/50/000000/iphone.png" alt="Phone" style={styles.phoneImage} />
        <div style={styles.text}>Мы всегда на связи</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '10px',  // Расположим элемент сверху
    right: '10px',  // Сдвигаем вправо
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'phoneRing 2s infinite',  // Добавляем анимацию для колебаний
  },
  phoneImage: {
    width: '50px',
    height: '50px',
    animation: 'ringing 1s ease-in-out infinite',  // Мелкая анимация для телефона
  },
  text: {
    color: '#fff',
    marginTop: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    animation: 'textBounce 1s infinite',  // Анимация текста
  },
};

// Анимации CSS для телефона и текста
const phoneStyles = `
  @keyframes phoneRing {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
    75% { transform: rotate(-10deg); }
    100% { transform: rotate(0deg); }
  }

  @keyframes ringing {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  @keyframes textBounce {
    0% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0); }
  }
`;

export function PhoneAnimationStyles() {
  return <style>{phoneStyles}</style>;
}
