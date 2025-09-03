const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, 'medical_app.db');

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
  } else {
    console.log('SQLite 데이터베이스에 연결되었습니다.');
    initDatabase();
  }
});

// 데이터베이스 초기화 (테이블 생성)
function initDatabase() {
  // 사용자 테이블 생성
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      birth TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('사용자 테이블 생성 오류:', err.message);
    } else {
      console.log('사용자 테이블이 생성되었습니다.');
    }
  });

  // 진료기록 테이블 생성
  db.run(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      reservationId INTEGER,
      title TEXT,
      date TEXT,
      diagnosis TEXT,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('진료기록 테이블 생성 오류:', err.message);
    } else {
      console.log('진료기록 테이블이 생성되었습니다.');
    }
  });

  // 예약 테이블 생성
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      purpose TEXT NOT NULL,
      status TEXT DEFAULT 'confirmed',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `, (err) => {
    if (err) {
      console.error('예약 테이블 생성 오류:', err.message);
    } else {
      console.log('예약 테이블이 생성되었습니다.');
      // 테스트 데이터 추가
      // insertTestData();
    }
  });
}

// 테스트 데이터 추가
function insertTestData() {
  // 테스트 사용자 추가
  const testUser = {
    email: 'test@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    name: '강종우',
    phone: '010-0000-0000'
  };

  db.get('SELECT id FROM users WHERE email = ?', [testUser.email], (err, row) => {
    if (err) {
      console.error('사용자 확인 오류:', err.message);
      return;
    }

    if (!row) {
      // 테스트 사용자 추가
      db.run(`
        INSERT INTO users (email, password, name, phone)
        VALUES (?, ?, ?, ?)
      `, [testUser.email, testUser.password, testUser.name, testUser.phone], function(err) {
        if (err) {
          console.error('테스트 사용자 추가 오류:', err.message);
        } else {
          console.log('테스트 사용자가 추가되었습니다. ID:', this.lastID);
          
          // 테스트 진료기록 추가
          const testRecords = [
            {
              userId: this.lastID,
              img: "/images/record1.jpeg",
              title: "악성 흑색종",
              date: "2025. 06. 23.",
              diagnosis: "악성 흑색종",
              confidence: 0.92,
              riskLevel: "높음",
              description: "악성 흑색종은 피부암의 일종으로 즉시 치료가 필요합니다.",
              recommendations: JSON.stringify([
                "피부과 전문의와 상담하세요.",
                "조직검사를 통해 확진을 받으세요.",
                "정기적으로 피부 상태를 관찰하세요."
              ])
            },
            {
              userId: this.lastID,
              img: "/images/record2.jpeg",
              title: "악성 흑색종",
              date: "2025. 06. 21.",
              diagnosis: "악성 흑색종",
              confidence: 0.88,
              riskLevel: "높음",
              description: "악성 흑색종 의심으로 추가 검사가 필요합니다.",
              recommendations: JSON.stringify([
                "피부과 전문의와 상담하세요.",
                "조직검사를 통해 확진을 받으세요.",
                "정기적으로 피부 상태를 관찰하세요."
              ])
            }
          ];

          testRecords.forEach(record => {
            db.run(`
              INSERT INTO medical_records (userId, img, title, date, diagnosis, confidence, riskLevel, description, recommendations)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              record.userId,
              record.img,
              record.title,
              record.date,
              record.diagnosis,
              record.confidence,
              record.riskLevel,
              record.description,
              record.recommendations
            ], (err) => {
              if (err) {
                console.error('테스트 진료기록 추가 오류:', err.message);
              } else {
                console.log('테스트 진료기록이 추가되었습니다.');
              }
            });
          });
        }
      });
    } else {
      console.log('테스트 사용자가 이미 존재합니다.');
    }
  });
}

// 데이터베이스 헬퍼 함수들
const dbHelper = {
  // 사용자 관련
  createUser: ({ email, password, name, phone, birth }) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password, name, phone, birth) VALUES (?, ?, ?, ?, ?)',
        [email, password, name, phone, birth],
        function(err) {
          if (err) {
            console.error('DB INSERT ERROR in createUser:', err.message); // 오류 로그 추가
            reject(err);
          } else {
            console.log(`DB INSERT SUCCESS: New user created with ID: ${this.lastID}`); // 성공 로그 추가
            db.get(
              'SELECT id, email, name, phone, birth FROM users WHERE id = ?',
              [this.lastID],
              (err, row) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(row);
                }
              }
            );
          }
        }
      );
    });
  },

  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT id, email, password, name, phone, birth FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  updateUser: (id, updates) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);

      db.run(`UPDATE users SET ${fields} WHERE id = ?`, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // 진료기록 관련
  getRecordsByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM medical_records 
        WHERE userId = ? 
        ORDER BY createdAt DESC
      `, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  async getRecordById(id) {
    return new Promise((resolve, reject) => {
      // id를 숫자로 변환하지 않고 문자열로 직접 비교
      db.get('SELECT * FROM medical_records WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  createRecord: (recordData) => {
    return new Promise((resolve, reject) => {
      const { userId, reservationId, title, date, diagnosis, image } = recordData;
      db.run(`
        INSERT INTO medical_records (userId, reservationId, title, date, diagnosis, image)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, reservationId, title, date, diagnosis, image], function(err) {
        if (err) {
          console.error('!!! [DB] INSERT 실패 !!!:', err); // 실패 로그 추가
          reject(err);
        } else {
          const newRecord = { id: this.lastID, ...recordData };
          console.log(`[DB] INSERT 성공. 생성된 ID: ${this.lastID}. 반환될 객체:`, newRecord); // 성공 로그 추가
          resolve(newRecord);
        }
      });
    });
  },

  deleteRecordById: (userId, recordId) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM medical_records WHERE id = ? AND userId = ?', [recordId, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // 예약 관련
  createReservation: (reservationData) => {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO reservations (userId, date, time, purpose)
        VALUES (?, ?, ?, ?)
      `, [
        reservationData.userId,
        reservationData.date,
        reservationData.time,
        reservationData.purpose
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...reservationData });
        }
      });
    });
  },

  getReservationsByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT * FROM reservations 
        WHERE userId = ? 
        ORDER BY date ASC, time ASC
      `, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  getReservationById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM reservations WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  updateReservation: (userId, updates) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push('CURRENT_TIMESTAMP'); // updatedAt
      values.push(userId);

      db.run(`UPDATE reservations SET ${fields}, updatedAt = ? WHERE userId = ?`, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  deleteReservation: (userId) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM reservations WHERE userId = ?', [userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // userId로 예약 수정
  updateReservationByUserId: (userId, updates) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(userId);
      db.run(
        `UPDATE reservations SET ${fields} WHERE userId = ?`,
        values,
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },

  // userId로 예약 삭제
  deleteReservationByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM reservations WHERE userId = ?',
        [userId],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },

  // 예약 PK(id)로 예약 수정
  updateReservationById: (id, updates) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);
      db.run(
        `UPDATE reservations SET ${fields} WHERE id = ?`,
        values,
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },

  // 예약 테이블에서 userId로 예약 1건을 조회하는 함수
  async getReservationByUserId(userId) {
    const row = await db.get('SELECT * FROM reservations WHERE userId = ?', [userId]);
    return row;
  },

  // userId로 예약을 삭제하는 함수
  deleteReservationByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM reservations WHERE userId = ?', [userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes });
        }
      });
    });
  }
};

// 예약 id로 예약 정보 수정
async function updateReservationById(id, updates) {
  // updates: { date, time }
  const { date, time } = updates;
  await db.run(
    'UPDATE reservations SET date = ?, time = ? WHERE id = ?',
    [date, time, id]
  );
}

module.exports = { db, dbHelper }; 