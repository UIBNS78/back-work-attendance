const user_table = 'crm_user';
const user_role_table = 'crm_user_role';
const user_permission_table = 'crm_user_permission';
const permission_table = 'crm_permission';
const role_table = 'crm_role';
const login_table = 'login';

const queries = {
    select: {
        ALL_USER: 
            `SELECT * FROM ${user_table} 
                INNER JOIN ${user_role_table} ON ${user_role_table}.user = ${user_table}.trigramme 
                LEFT JOIN ${user_permission_table} ON ${user_permission_table}.user_name = ${user_table}.trigramme
                LIMIT 10;`,

        ALL_USER_BY_STATUS: status => 
            `SELECT * FROM ${user_table} 
                INNER JOIN ${user_role_table} ON ${user_role_table}.user = ${user_table}.trigramme 
                LEFT JOIN ${user_permission_table} ON ${user_permission_table}.user_name = ${user_table}.trigramme
                WHERE ${user_role_table}.actif = '${status}';`,

        USER_STATUS: trigram => `SELECT actif FROM ${user_role_table} WHERE user = '${trigram}';`,

        USER_ROLE_BY_TRIGRAM: trigram => `SELECT role_slug, actif FROM ${user_role_table} WHERE user = '${trigram}' AND actif = '1';`,

        USER_BY_TRIGRAM: trigram => 
            `SELECT trigramme, matricule, nom, prenom, email, direction, fonction, n_1, GROUP_CONCAT(permission) AS permissions FROM ${user_table} ut
                LEFT JOIN ${user_permission_table} pt ON pt.user_name = ut.trigramme
                WHERE ut.trigramme = '${trigram}';`,
        
        ALL_USER_BY_DIRECITON: direction => 
            `SELECT * FROM ${user_table} 
                INNER JOIN ${user_role_table} ON ${user_role_table}.actif = '1' AND ${user_role_table}.user = ${user_table}.trigramme 
                LEFT JOIN ${user_permission_table} ON ${user_permission_table}.user_name = ${user_table}.trigramme
                WHERE ${user_table}.direction = '${direction}';`,

        ALL_USER_BY_MANAGER: manager => 
            `SELECT * FROM ${user_table} 
                INNER JOIN ${user_role_table} ON ${user_role_table}.actif = '1' AND ${user_role_table}.user = ${user_table}.trigramme 
                LEFT JOIN ${user_permission_table} ON ${user_permission_table}.user_name = ${user_table}.trigramme 
                WHERE ${user_table}.n_1 = '${manager}';`,

        ALL_DIRECTION:
            `SELECT direction FROM ${user_table};`,

        ALL_MANAGER:
            `SELECT n_1 FROM ${user_table};`,
            
        ALL_RULE_SLUG:
            `SELECT slug FROM ${role_table};`,

        ALL_PERMISSION:
            `SELECT slug FROM ${permission_table};`,

        ALL_PERMISSION_BY_TRIGRAM: trigram => 
            `SELECT permission FROM ${user_permission_table} WHERE user_name = '${trigram}';`,

        LOGIN: username => `SELECT * FROM ${login_table} WHERE username = '${username}'`,
    },
    insert: {
        PERMISSION_FOR: (trigram, permission) =>
            `INSERT INTO ${user_permission_table} (user_name, permission) VALUES ('${trigram.toUpperCase()}', '${permission}');`,
        
        NEW_USER: user => 
        `INSERT INTO ${user_table} (trigramme, matricule, nom, prenom, email, direction, fonction, n_1) VALUES 
            ('${user.trigram.toUpperCase()}', ${user.matricule}, '${user.name}', '${user.firstName}', '${user.email}', '${user.direction}', '${user.job}', '${user.chief}');`,

        NEW_USER_ROLE: (trigram, role) => 
            `INSERT INTO ${user_role_table} (user, role_slug, actif) VALUES
                ('${trigram.toUpperCase()}', '${role}', '1');`,

        NEW_USER_PERMISSION: (trigram, permission) => 
            `INSERT INTO ${user_permission_table} (user_name, permission) VALUES
                ('${trigram.toUpperCase()}', '${permission}');`,

        SIGNUP: (username, password) => 
            `INSERT INTO ${login_table} (username, password, creation_date, last_login_date) VALUES
                ('${username}', '${password}', ${Date.now()}, ${Date.now()});`,
    },
    update: {
        STATUS_BY_TRIGRAM: (trigram, status) => 
            `UPDATE ${user_role_table} SET actif = '${status}' WHERE user = '${trigram}'`,
        USER_INFO_BY_TRIGRAM: (trigram, user) => 
            `UPDATE ${user_table} SET
                trigramme = '${user.trigram.toUpperCase()}',
                matricule = ${user.matricule},
                nom = '${user.nom}',
                prenom = '${user.prenom}',
                email = '${user.email}',
                direction = '${user.direction}',
                fonction = "${user.fonction}",
                n_1 = '${user.n_1}' 
                WHERE trigramme = '${trigram}';`,
        USER_RULE: (trigram, rule) =>
            `UPDATE ${user_role_table} SET role_slug = '${rule}' WHERE user = '${trigram}';`,
    },
    delete: {
        ALL_PERMISSION_FOR: trigram =>
            `DELETE FROM ${user_permission_table} WHERE user_name = '${trigram}';`,

        USER_BY_TRIGRAM: trigram =>
            `DELETE FROM ${user_table} WHERE trigramme = '${trigram}';`,
        
        RULE_BY_TRIGRAM: trigram =>
            `DELETE FROM ${user_role_table} WHERE user = '${trigram}';`,
    }
}

module.exports = queries;