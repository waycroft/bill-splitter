import { Link } from 'remix';

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1 className="text-3xl p-2">Bill Splitter</h1>
      <nav className='menu bg-primary w-56 p-2 rounded-box'>
        <ol>
          <li key="pools">
            <Link to="pools">/pools</Link>
          </li>
          <li key="users/search">
            <Link to="users/search">/users/search</Link>
          </li>
        </ol>
      </nav>
    </div>
  );
}
