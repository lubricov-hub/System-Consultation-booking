import { COLORS } from "../constants";

export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 16,
      border: `1px solid ${COLORS.border}`,
      padding: 24,
      ...style
    }}>
      {children}
    </div>
  );
}