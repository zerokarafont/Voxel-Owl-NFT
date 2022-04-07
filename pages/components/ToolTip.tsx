import React from 'react';

interface IProps {
  message: string,
  onClose: () => void
}

const ToolTip: React.FC<IProps> = ({ message, onClose }) => {
  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '5px',
      backgroundColor: 'rgb(242, 153, 74)'
    }}>
      {message}&nbsp;<span onClick={onClose} style={{ color: 'white' }}>×</span>
    </div>
  )
}

export default ToolTip;