import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "40px", 
          fontFamily: "sans-serif",
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          <h1 style={{ color: "#dc2626", marginBottom: "20px" }}>
            Une erreur s'est produite
          </h1>
          <p style={{ marginBottom: "20px", color: "#6b7280" }}>
            L'application n'a pas pu se charger correctement.
          </p>
          {this.state.error && (
            <details style={{ 
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              textAlign: "left"
            }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                Détails de l'erreur
              </summary>
              <pre style={{ 
                marginTop: "10px",
                overflow: "auto",
                fontSize: "12px",
                color: "#dc2626"
              }}>
                {this.state.error.toString()}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

