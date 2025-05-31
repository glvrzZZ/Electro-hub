import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновляем состояние, чтобы показать запасной UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Логируем ошибку куда-нибудь, если нужно
    console.error("Ошибка в приложении:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h1>Упс! Что-то пошло не так.</h1>
          <p>Пожалуйста, обновите страницу или попробуйте позже.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
