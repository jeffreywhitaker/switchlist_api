module.exports = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './data/switchlist.db',
      },
      useNullAsDefault: true,
      migrations: {
        directory: null,
      },
      seeds: {
        directory: null,
      },
    },
  };