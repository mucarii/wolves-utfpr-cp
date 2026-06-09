import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8 text-center">
          <p className="text-white font-bold text-lg">Algo deu errado</p>
          <p className="text-gray-400 text-sm max-w-sm">
            Ocorreu um erro inesperado. Recarregue a página para tentar novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#0c4dbe] hover:bg-[#0a42a8] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
