exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries and resets ids
    return knex('users')
      .truncate()
      .then(function() {
        return knex('users').insert([
          { id:1, username: 'sagun', password: "$2a$08$9X.oiBUH0H0GL6NZTxNK6.Z.wFFCExU/5TepaQ2/jzydUsj3/tdBC" },
        ]);
      });
  };