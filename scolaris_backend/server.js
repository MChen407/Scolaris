const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'scolaris_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Base de données SQLite
const db = new sqlite3.Database('./scolaris.db');

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nom d\'utilisateur et mot de passe requis' 
    });
  }

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur serveur' 
        });
      }

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ 
          success: false, 
          message: 'Mot de passe incorrect' 
        });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          schoolId: user.school_id 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          schoolId: user.school_id
        }
      });
    }
  );
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, username, name, email, role, school_id FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          schoolId: user.school_id
        }
      });
    }
  );
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Déconnexion réussie' });
});

// Routes des établissements
app.get('/api/schools/:schoolId/info', authenticateToken, (req, res) => {
  const { schoolId } = req.params;

  if (req.user.schoolId !== schoolId) {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès non autorisé' 
    });
  }

  db.get(
    'SELECT * FROM schools WHERE id = ?',
    [schoolId],
    (err, school) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur serveur' 
        });
      }

      if (!school) {
        return res.status(404).json({ 
          success: false, 
          message: 'Établissement non trouvé' 
        });
      }

      res.json({
        success: true,
        school: {
          id: school.id,
          name: school.name,
          address: school.address,
          phone: school.phone,
          email: school.email,
          logo: school.logo,
          createdAt: school.created_at,
          updatedAt: school.updated_at
        }
      });
    }
  );
});

app.put('/api/schools/:schoolId/info', authenticateToken, (req, res) => {
  const { schoolId } = req.params;
  const { name, address, phone, email, logo } = req.body;

  if (req.user.schoolId !== schoolId) {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès non autorisé' 
    });
  }

  db.run(
    'UPDATE schools SET name = ?, address = ?, phone = ?, email = ?, logo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, address, phone, email, logo, schoolId],
    function(err) {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur lors de la mise à jour' 
        });
      }

      db.get(
        'SELECT * FROM schools WHERE id = ?',
        [schoolId],
        (err, school) => {
          if (err || !school) {
            return res.status(500).json({ 
              success: false, 
              message: 'Erreur lors de la récupération' 
            });
          }

          res.json({
            success: true,
            school: {
              id: school.id,
              name: school.name,
              address: school.address,
              phone: school.phone,
              email: school.email,
              logo: school.logo,
              createdAt: school.created_at,
              updatedAt: school.updated_at
            }
          });
        }
      );
    }
  );
});

// Routes utilisateurs
app.put('/api/users/profile', authenticateToken, (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur lors du hashage du mot de passe' 
        });
      }

      db.run(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, hashedPassword, userId],
        function(err) {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: 'Erreur lors de la mise à jour' 
            });
          }

          res.json({ success: true, message: 'Profil mis à jour avec succès' });
        }
      );
    });
  } else {
    db.run(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la mise à jour' 
          });
        }

        res.json({ success: true, message: 'Profil mis à jour avec succès' });
      }
    );
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});