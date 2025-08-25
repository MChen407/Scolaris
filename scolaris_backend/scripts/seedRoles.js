import { Role, User } from '../src/models/index.model.js';
import bcrypt from 'bcryptjs';

async function seedRoles() {
  try {
    const roles = [
      {
        name: 'admin',
        description: 'Administrateur système',
        permissions: {
          students: { read: true, write: true, delete: true },
          teachers: { read: true, write: true, delete: true },
          classes: { read: true, write: true, delete: true },
          finance: { read: true, write: true, delete: true },
          users: { read: true, write: true, delete: true }
        }
      },
      {
        name: 'secretaire',
        description: 'Secrétaire',
        permissions: {
          students: { read: true, write: true, delete: false },
          teachers: { read: true, write: false, delete: false },
          classes: { read: true, write: true, delete: false },
          finance: { read: true, write: false, delete: false },
          users: { read: false, write: false, delete: false }
        }
      },
      {
        name: 'comptable',
        description: 'Comptable',
        permissions: {
          students: { read: true, write: false, delete: false },
          teachers: { read: true, write: false, delete: false },
          classes: { read: true, write: false, delete: false },
          finance: { read: true, write: true, delete: true },
          users: { read: false, write: false, delete: false }
        }
      }
    ];

    for (const roleData of roles) {
      await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData
      });
    }

    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        email: 'admin@scolaris.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'System',
        roleId: adminRole.id,
        isActive: true
      }
    });

    console.log('Rôles et utilisateur admin créés avec succès');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

seedRoles();