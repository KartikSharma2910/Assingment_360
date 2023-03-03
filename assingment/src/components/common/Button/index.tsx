type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const Button = ({ label, disabled, onClick, className }: ButtonProps) => {
  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
