const PaginationUtils = require('../../../utils/PaginationUtils');

async function createRide(reqRide, db) {
  return new Promise((resolve, reject) => {
    const {
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      riderName,
      driverName,
      driverVehicle
    } = reqRide;
    const values = [
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      riderName,
      driverName,
      driverVehicle
    ];
    db.run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
      function(err) {
        if (err) {
          return reject(err);
        }
        db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function(
          error,
          rows
        ) {
          if (error) {
            return reject(error);
          }
          return resolve(rows);
        });
      }
    );
  });
}

async function getRideWithPaging(pageRequest, db) {
  return new Promise((resolve, reject) => {
    const { skip, limit } = pageRequest;
    db.all('SELECT * FROM Rides LIMIT ? OFFSET ?', [limit, skip], function(
      error,
      rowQuery
    ) {
      if (error) {
        return reject(error);
      }
      return resolve(rowQuery);
    });
  });
}

async function getRideCount(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT COUNT(*) FROM Rides', function(error, rowCount) {
      if (error) {
        return reject(error);
      }
      return resolve(rowCount[0]['COUNT(*)']);
    });
  });
}

async function getRides(pageRequest, db) {
  const [data, count] = await Promise.all([
    getRideWithPaging(pageRequest, db),
    getRideCount(db)
  ]);
  return PaginationUtils.getPaginationResult(data, count, pageRequest);
}

async function getRideById(id, db) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Rides WHERE rideID = ?`, id, function(err, rows) {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    });
  });
}

module.exports = {
  createRide,
  getRides,
  getRideById
};
