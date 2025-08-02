import React from 'react'

const Stats: React.FC = () => {
  return (
    <div className="w-full h-full">
      <iframe
        src="https://stats.internetmoney.io/"
        className="w-full h-full border-0"
        title="Internet Money Stats"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default Stats 