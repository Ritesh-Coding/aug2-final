import React from 'react'

interface CardProps{
  title : string,
  content : string
}
const Card: React.FC<CardProps> = (props) => {
  return (
    
    <div
      className="e-card e-card-horizontal"
      style={{ width: `400px` }}
    >
      <div className="e-card-stacked">
        <div className="e-card-header">
          <div className="e-card-header-caption">
            <div className="e-card-header-title">{props.title}</div>
          </div>
        </div>
        <div className="e-card-content">
          {props.content}
        </div>
      </div>
    </div>
  )
}

export default Card