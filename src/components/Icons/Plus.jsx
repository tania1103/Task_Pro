const Plus = ({
  width = '14px',
  height = '14px',
  fillColor = 'none',
  strokeColor = 'black'    
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill={fillColor}
      stroke={strokeColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4.16663V15.8333"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.1665 10H15.8332"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Plus;
