export function loadUser(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        name: 'tony',
      },
    });
  }, 1000);
}

export function loadPageData(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        foo: 'bar',
      },
    });
  }, 2000);
}

