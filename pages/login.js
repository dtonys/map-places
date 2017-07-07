import Layout from 'components/Layout';

const mockSubmit = (event) => { event.preventDefault(); };

export default () => (
  <div>
    <Layout htmlTitle={'Login'}>
      <div>
        <div style={{ marginTop: '50px' }} />
        <div className="formWrap">
          <form method="post" action="" className="form loginForm" onSubmit={mockSubmit} >
            <h3> Login </h3>
            <fieldset>
              <div className="form-item">
                <label htmlFor="email" >Email</label>
                <input type="email" name="user-email" id="email" />
              </div>
              <div className="form-item">
                <label htmlFor="password" >Password</label>
                <input type="password" name="user-password" id="password" />
              </div>
              <div className="form-item">
                <button className="w50" >Submit</button>
              </div>
            </fieldset>
          </form>
        </div>
        <style jsx>{`
          .loginForm {
            width: 600px;
            margin: auto;
          }
          .formWrap {
            padding: 0 10px;
          }
        `}</style>
      </div>
    </Layout>
  </div>
);
