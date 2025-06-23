const Burger = ({
  width = '14px',
  height = '14px',
  fillColor = 'none',
  strokeColor = 'white'   
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill={fillColor}
      stroke={strokeColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 16H28"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 8H28"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 24H28"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Burger;
