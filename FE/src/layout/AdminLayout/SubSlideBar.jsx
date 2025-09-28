import { Link } from "react-router-dom";
export default function SubSlideBar({ items }) {
  return (
    <ul className="subItems">
      {items.map((item, index) => {
        return (
          <li key={index}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}
