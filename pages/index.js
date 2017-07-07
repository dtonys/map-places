import Link from 'next/link';

import Layout from 'components/Layout';

export default () => (
  <div>
    <Layout htmlTitle={'Home'}>
      <br />
      <Link href="/login" >
        <a>Login</a>
      </Link>
      <br />
      <Link href="/signup" >
        <a>Signup</a>
      </Link>
      <div className="content">content</div>
      <br /><br /><br /><br /><br /><br />
      <div className="content">content</div>
      <br /><br /><br /><br /><br /><br />
      <div className="content">content</div>
      <br /><br /><br /><br /><br /><br />
      <div className="content">content</div>
      <br /><br /><br /><br /><br /><br />
    </Layout>
  </div>
);
