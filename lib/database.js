const fs = require("fs");
const path = require("path");

class Database {
	#data;

	constructor(filename) {
		this.databaseFile = path.join(filename);
		this.#data = {};
	}

	default = () => {
		return {
			sudoUsers: [],
			groups: {},
			settings: {
				public: true,
				shouldHideNumber: true, // set to false to change
				menuType: 'v2'
			}
		};
	};

	init = async () => {
		const data = await this.read();
		this.#data = { ...this.default(), ...data };
		return this.#data;
	};

	read = async () => {
		try {
			if (fs.existsSync(this.databaseFile)) {
				const data = fs.readFileSync(this.databaseFile, 'utf8');
				return JSON.parse(data);
			} else {
				return this.default();
			}
		} catch (error) {
			console.error('Error reading database file:', error);
			return this.default();
		}
	};

	save = async () => {
		try {
			const dir = path.dirname(this.databaseFile);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			const jsonData = JSON.stringify(this.#data, null, 2);
			fs.writeFileSync(this.databaseFile, jsonData, 'utf8');
		} catch (error) {
			console.error('Error saving database:', error);
			throw error;
		}
	};


	add = async (type, newData) => {
		if (!type) return 'Type required to be added'
			if(!newData){
				this.#data[type] = {}
			} else {
				this.#data[type] = newData
			}

		await this.save();
		return this.#data[type][newData] || this.#data[type];
	}


	addGroup = async (type, jid, newData) => {
		if (!type || !jid) {
			throw new Error('Type and JID are required');
		}
    
		if (!this.#data[type]) {
			this.#data[type] = {};
		}
    
		this.#data[type][jid] = newData;
		await this.save();
		return this.#data[type][jid];
	};


	editData = async (type, jid, newData, subData) => {
		if (!type) return 'Type required to be added';
    
		if (!this.#data[type]) {
			this.#data[type] = {};
		}
		if (jid && !this.#data[type][jid]) {
			this.#data[type][jid] = {};
		}
    
		if (!jid) {
			this.#data[type] = newData || {};
		} else if (subData) {
			this.#data[type][jid][subData] = newData;
		} else {
			this.#data[type][jid] = newData || {};
		}
    
		await this.save();
		return this.#data[type][jid] || this.#data[type];
	};
  

	delete = async (type, jid) => {
		if (!jid) {
			delete this.#data[type];
			await this.save();
			return `- ${type} has been deleted.`; 
		} else {
			delete this.#data[type][jid];
			await this.save();
			return `- ${type} with ID ${jid} has been deleted.`;
		}
	};

	
	get = (type, jid) => {
		if (this.#data[type]) {
			if (jid) {
				return this.#data[type][jid] || `- ${type} with ID ${jid} not found!`;
			}
			return this.#data[type];
		} else {
			return `- Data type ${type} not found!`;
		}
	};


	createBackup = async () => {
		const backupFile = this.databaseFile + '.backup.' + Date.now();
		try {
			fs.copyFileSync(this.databaseFile, backupFile);
			return backupFile;
		} catch (error) {
			console.error('Backup failed:', error);
			return null;
		}
	};

	restoreFromBackup = async (backupFile) => {
		if (!fs.existsSync(backupFile)) {
			throw new Error('Backup file not found');
		}
    
		const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
		this.#data = { ...this.default(), ...backupData };
		await this.save();
		return this.#data;
	};

	addSudoUsers = async (jid) => {
		if (!Array.isArray(this.#data.sudoUsers)) {
			this.#data.sudoUsers = [];
		}
  
		if (!this.#data.sudoUsers.includes(jid)) {
			this.#data.sudoUsers.push(jid);
			await this.save();
			return `Done`;
		} else {
			return `${jid} is already a sudo user`;
		}
	};

	removeSudoUsers = async (jid) => {
		if (!Array.isArray(this.#data.sudoUsers)) {
			this.#data.sudoUsers = [];
		}
  
		const index = this.#data.sudoUsers.indexOf(jid);
		if (index > -1) {
			this.#data.sudoUsers.splice(index, 1);
			await this.save();
			return `Done`;
		} else {
			return `${jid} is not a sudo user`;
		}
	};

	isSudoUser = (jid) => {
		return Array.isArray(this.#data.sudoUsers) && this.#data.sudoUsers.includes(jid);
	};

	getSudoUsers = () => {
		return this.#data.sudoUsers || [];
	};

	getStats = () => {
		return {
			totalGroups: Object.keys(this.#data.groups || {}).length,
			totalSudoUsers: (this.#data.sudoUsers || []).length,
			totalSettings: Object.keys(this.#data.settings || {}).length,
			databaseSize: fs.existsSync(this.databaseFile) ? fs.statSync(this.databaseFile).size : 0
		};
	};


  main = async (m) => {
    await this.init();
    
    if (m.isGroup) {
      await this.addGroup('groups', m.chat, {
        enable: false,
        welcome: false,   
        chatbot: false
      });
    }
    
    await this.save();
    return this.list();
  };

  list = () => {
    return this.#data;
  };
}

module.exports = Database;
