import { Link } from 'remix';

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Bill Splitter</h1>
      <nav>
        <ol>
          <li>
            <Link to="pools">/pools</Link>
          </li>
        </ol>
      </nav>
    </div>
  );
}
