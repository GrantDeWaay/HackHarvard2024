import React from 'react';

interface StateButtonProps {
  onClick?: () => void;
  state: 'start' | 'listening' | 'loading';
}

const StateButton: React.FC<StateButtonProps> = ({ onClick, state }) => {
  const getButtonStyle = () => {
    switch (state) {
      case 'start':
        return { backgroundColor: 'green', cursor: 'pointer' };
      case 'listening':
      case 'loading':
        return { backgroundColor: 'grey', cursor: 'not-allowed' };
      default:
        return {};
    }
  };

  return (
    <button
      className="state-button"
      style={getButtonStyle()}
      onClick={state === 'start' ? onClick : undefined} // Allow click only if state is 'start'
      disabled={state !== 'start'} // Disable button if not in 'start' state
    >
      {state === 'start'
        ? 'Start'
        : state === 'listening'
        ? 'Listening...'
        : 'Loading...'}
    </button>
  );
};

export default StateButton;
