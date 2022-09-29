<template>
  <div class="cont">
    <h1 class="header">Панель управления</h1>
    <div class="field">
      <b>Токен</b>
      <div class="cont2">
        <input @focus="isTokenHidden = false" :type="isTokenHidden? 'password' : ''" v-model="token"
               placeholder="токен">
      </div>
      <button id="token-btn" @click="write_token">Записать</button>
    </div>

    <div class="field field2">
      <b>Прибавить команде баллы</b>
      <div class="cont2">
        <select v-model="update_building">
          <option value="" disabled>выберите отделение</option>
          <option v-for="build in buildings">{{ build }} отд.</option>
        </select>
        <select v-model="update_team_name">
          <option value="" disabled>выберите команду</option>
          <option v-for="i in get_building_list(+update_building[0])">{{ i.name }}</option>
        </select>
        <select v-model="update_subject">
          <option value="" disabled>выберите предмет</option>
          <option v-for="i in subjects">
            {{ i }}
          </option>
        </select>
        <select v-model="update_task_name">
          <option value="" disabled>выберите задание</option>
          <option v-for="i in get_subject_list(update_subject)">
            {{ i.name }}
          </option>
        </select>
        <input v-model="update_balance" placeholder="количество баллов">
        <button @click="updateResult">Прибавить</button>
      </div>
    </div>

    <div class="field field3">
      <b>Таблица</b>
      <div id="autizm">Присвоение нового значения происходит после нажатия кнопки ОК около
        соответствующей ячейки
      </div>
      <button @click="update_stupid" style="margin-bottom: 5px">Обновить таблицу</button>
      <div class="scrolly" :class="{'loading-flex' : !this.show_table}">
        <div class="table-res">
          <strong class="loading" v-show="!show_table">
            Загрузка
          </strong>
          <table v-show="show_table">
            <thead>
            <tr>
              <th><b></b></th>
              <th v-for="i in teams">{{ i.name }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="i in tasks.length">
              <th>{{ tasks[i - 1].name }}</th>
              <td v-for="j in teams.length">
                <div class="item-table">
                  <input type="number" v-if="this.resultsTable.length >= i && this.resultsTable[0].length >= j"
                         v-model="this.resultsTable[i - 1][j - 1]" class="item">
                  <button @click="update_element(teams[j - 1].id, tasks[i - 1].id, this.resultsTable[i - 1][j - 1])"
                          v-if="this.resultsTable.length >= i && this.resultsTable[0].length >= j && this.copyResultsTable[i - 1][j - 1] !== this.resultsTable[i - 1][j - 1]">
                    ОК
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="table-field">
      <div class="task-field">
        <div class="field">
          <b>Добавить команду</b>
          <div class="cont2">
            <input v-model="new_team_name" placeholder="название">
            <select v-model="new_team_building">
              <option disabled value="">выберите отделение</option>
              <option v-for="build in buildings">{{ build }} отд.</option>
            </select>
            <button @click="add_team">Добавить</button>
          </div>
        </div>

        <div class="field">
          <b>Удалить команду</b>
          <div class="cont2">
            <select v-model="remove_team_building">
              <option disabled value="">выберите отделение</option>
              <option v-for="build in buildings">{{ build }} отд.</option>
            </select>
            <select v-model="remove_team_name">
              <option disabled value="">выберите команду</option>
              <option v-for="team in get_building_list(+this.remove_team_building[0])">{{ team.name }}</option>
            </select>
            <button @click="remove_team">Удалить</button>
          </div>
        </div>
      </div>
      <div class="task-field">
        <div class="field">
          <b>Добавить задание</b>
          <div class="cont2">
            <select v-model="new_task_subject">
              <option disabled value="">выберите предмет</option>
              <option v-for="sub in subjects">{{ sub }}</option>
            </select>
            <input v-model="new_task_name" placeholder="название">
            <button @click="add_task">Добавить</button>
          </div>
        </div>

        <div class="field">
          <b>Удалить задание</b>
          <div class="cont2">
            <select v-model="remove_task_subject">
              <option disabled value="">выберите предмет</option>
              <option v-for="sub in subjects">{{ sub }}</option>
            </select>
            <select v-model="remove_task_name">
              <option disabled value="">выберите название</option>
              <option v-for="sub in get_subject_list(this.remove_task_subject)">{{ sub.name }}</option>
            </select>
            <button @click="remove_task">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <div class="cont3">
      <div class="field">
        <h1>Список команд</h1>
        <div v-for="i in teams" class="list">
          <b>id: </b>{{ i.id }}, <b>отделение: </b>{{ i.building }}, <b>название: </b>{{ i.name }}
        </div>
      </div>

      <div class="field">
        <h1>Список заданий</h1>
        <div v-for="i in tasks" class="list">
          <b>id: </b>{{ i.id }}, <b>предмет: </b> {{ i.subject }}, <b>название: </b>{{ i.name }}
        </div>
      </div>
    </div>

    <div class="field" style="padding: 40px">
      <h1>Критическая инфраструктура</h1>
      <b>Изменить значение date (не менять без представителя от разработчиков)</b>
      <div style="margin-top: 10px">
        <b style="font-size: 10px">Записывать в формате :: October 10, 2022 10:00</b>
      </div>
      <div class="cont2">
        <input v-model="new_data_val" placeholder="новое значение">
        <button @click="post_data">Изменить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "panel",
  data() {
    return {
      token: "",
      teams: [],
      tasks: [],
      results: {},
      resultsTable: [[]],
      copyResultsTable: [[]],
      subjects: [
          'биология',
          'география',
          'информатика',
          'история',
          'лингвистика',
          'литература',
          'математика',
          'мхк',
          'физика',
          'химия',
          'экономика',
      ],
      buildings: [
        1, 3
      ],
      isTokenHidden: true,

      new_data_val: "",

      new_team_name: "",
      new_team_building: "",

      remove_team_building: "",
      remove_team_name: "",

      new_task_subject: "",
      new_task_name: "",

      remove_task_subject: "",
      remove_task_name: "",

      update_building: "",
      update_team_name: "",
      update_subject: "",
      update_task_name: "",
      update_balance: "",

      show_table: false
    }
  },
  methods: {
    write_token() {
      this.isTokenHidden = true;
      localStorage['token'] = this.token;
    },

    async getTeamList() {
      let res = await fetch('https://back.is57.ru/teams', {
        mode: "cors"
      });
      if (res.ok) {
        res = await res.json();
        return res;
      } else {
        return [];
      }
    },

    async getTaskList() {
      let res = await fetch('https://back.is57.ru/tasks', {
        mode: "cors"
      });
      if (res.ok) {
        res = await res.json();
        return res;
      } else {
        return [];
      }
    },

    async getResultList() {
      let res = await fetch('https://back.is57.ru/results', {
        mode: "cors"
      });
      if (res.ok) {
        res = await res.json();
        return res;
      } else {
        return [];
      }
    },

    async post_data() {
      let res = await fetch(`https://back.is57.ru/date/set?token=${this.token}&value=${this.new_data_val}`);
      if (await res.text() !== 'invalid token') {
        this.new_data_val = '';
      } else {
        alert('Неверный токен')
      }
    },

    async add_team() {
      this.new_team_name = this.new_team_name.trim();
      if (!this.token || !this.new_team_name || !this.new_team_building) {
        alert('Вы не выбрали отделение, или не ввели токен, или не ввели название')
        return;
      }
      let building = this.new_team_building[0];
      let name = this.new_team_name;
      this.new_team_name = "";
      this.new_team_building = "";
      let check_res = await this.getTeamList();
      for (let i of check_res) {
        if (i.name === name) {
          alert('Не может быть двух команд с одинаковым названием')
          return;
        }
      }
      let res = await fetch(`https://back.is57.ru/teams/add?building=${building}&name=${name}&token=${this.token}`);
      if (await res.text() !== 'invalid token') {
        this.new_team_name = "";
        this.new_team_building = "";
      } else {
        alert('Неверный токен')
        return;
      }
      this.teams = await this.getTeamList();
      this.teams.sort((b, a) => {
        return a.building > b.building ? -1 : a.building === b.building ? 0 : 1;
      })
      this.tasks.sort((a, b) => {
        return a.subject < b.subject ? -1 : a.subject === b.subject ? 0 : 1;
      });
      this.results = await this.getResultList();
      this.rebuild(this.results);
    },

    get_building_list(val) {
      let res = [];
      if (!val) {
        res = this.teams;
      } else {
        for (let i of this.teams) {
          if (i.building === val) {
            res.push(i);
          }
        }
      }
      return res;
    },

    get_subject_list(val) {
      let res = [];
      if (!val) {
        res = this.tasks;
      } else {
        for (let i of this.tasks) {
          if (i.subject === val) {
            res.push(i);
          }
        }
      }
      return res;
    },

    async remove_team() {
      if (!this.token || !this.remove_team_name || !this.remove_team_building) {
        alert('Вы не ввели токен или не ввели название')
        return;
      }
      let id = -1;
      for (let i of this.teams) {
        if (i.building === +this.remove_team_building[0] && i.name === this.remove_team_name) {
          id = i.id;
          break;
        }
      }
      if (id === -1) {
        return;
      }
      this.remove_team_building = "";
      this.remove_team_name = "";
      let res = await fetch(`https://back.is57.ru/teams/del?token=${this.token}&id=${id}`);
      if (await res.text() !== 'invalid token') {
        this.remove_team_name = "";
        this.remove_team_building = "";
      } else {
        alert('Неверный токен')
        return;
      }
      this.teams = await this.getTeamList();
      this.teams.sort((b, a) => {
        return a.building > b.building ? -1 : a.building === b.building ? 0 : 1;
      })
      this.tasks.sort((a, b) => {
        return a.subject < b.subject ? -1 : a.subject === b.subject ? 0 : 1;
      })
      this.results = await this.getResultList();
      this.rebuild(this.results);
    },

    async add_task() {
      this.new_task_name = this.new_task_name.trim();
      if (!this.token || !this.new_task_subject || !this.new_task_name) {
        alert('Вы не выбрали предмет, или не ввели токен, или не ввели название');
        return;
      }
      for (let i of this.tasks) {
        if (i.name === this.new_task_name && i.subject === this.new_task_subject) {
          alert('Не может быть двух одинаковых по названию заданий')
          return;
        }
      }
      let task_sub = this.new_task_subject;
      let task_name = this.new_task_name;
      this.new_task_name = "";
      this.new_task_subject = "";
      let res = await fetch(`https://back.is57.ru/tasks/add?subject=${task_sub}&name=${task_name}&token=${this.token}`);
      if (await res.text() !== 'invalid token') {
        this.new_task_name = "";
        this.new_task_subject = "";
      } else {
        alert('Неверный токен')
        return;
      }
      this.tasks = await this.getTaskList();
      this.teams.sort((b, a) => {
        return a.building > b.building ? -1 : a.building === b.building ? 0 : 1;
      })
      this.tasks.sort((a, b) => {
        return a.subject < b.subject ? -1 : a.subject === b.subject ? 0 : 1;
      })
      this.results = await this.getResultList();
      this.rebuild(this.results);
    },

    async remove_task() {
      if (!this.token || !this.remove_task_name || !this.remove_task_subject) {
        alert('Вы не ввели токен или не ввели название');
        return;
      }
      let id = -1;
      for (let i of this.tasks) {
        if (i.name === this.remove_task_name && i.subject === this.remove_task_subject) {
          id = i.id;
          break;
        }
      }
      let res = await fetch(`https://back.is57.ru/tasks/del?id=${id}&token=${this.token}`);
      if (await res.text() !== 'invalid token') {
        this.remove_task_name = "";
        this.remove_task_subject = "";
      } else {
        alert('Неверный токен')
        return;
      }
      this.tasks = await this.getTaskList();
      this.teams.sort((b, a) => {
        return a.building > b.building ? -1 : a.building === b.building ? 0 : 1;
      })
      this.tasks.sort((a, b) => {
        return a.subject < b.subject ? -1 : a.subject === b.subject ? 0 : 1;
      })
      this.results = await this.getResultList();
      this.rebuild(this.results);
    },

    async get_smart_result(team_id, task_id) {
      let total = await fetch('https://back.is57.ru/results');
      if (!total.ok) {
        return 0;
      }
      total = await total.json();
      for (let i of total[team_id].results) {
        if (i.taskInfo.id === task_id) {
          return i.result;
        }
      }
      return 0;
    },

    get_team_id(building, name) {
      for (let i of this.teams) {
        if (i.name === name && i.building === +building[0]) {
          return i.id;
        }
      }
    },

    get_task_id(subject, name) {
      for (let i of this.tasks) {
        if (i.name === name && i.subject === subject) {
          return i.id;
        }
      }
    },

    async updateResult() {
      if (!this.token || !this.update_balance || !this.update_team_name || !this.update_task_name || !this.update_subject || !this.update_building) {
        alert('Вы что-то забыли указать (возможно токен)');
        return;
      }
      let team_id = this.get_team_id(this.update_building, this.update_team_name);
      let task_id = this.get_task_id(this.update_subject, this.update_task_name);
      if (!team_id || !task_id) {
        alert('Что-то не так');
        return;
      }
      let val = +this.update_balance;
      this.update_balance = "";
      this.update_team_name = "";
      this.update_task_name = "";
      val += await this.get_smart_result(team_id, task_id);
      let res = await fetch(`https://back.is57.ru/results/set?token=${this.token}&team_id=${team_id}&task_id=${task_id}&value=${val}`);
      this.results = await this.getResultList();
      this.rebuild(this.results);
      if (await res.text() !== 'invalid token') {
      } else {
        alert('Неверный токен')
      }
    },

    async update_stupid() {
      this.show_table = false;
      this.results = await this.getResultList().then((e) => {
        let width = this.teams.length;
        let height = this.tasks.length;
        this.resultsTable = new Array(height);
        this.copyResultsTable = new Array(height);
        for (let i = 0; i < height; i++) {
          this.resultsTable[i] = new Array(width);
          this.copyResultsTable[i] = new Array(width);
        }
        let arr = {};
        for (let i = 0; i < this.tasks.length; i++) {
          arr[this.tasks[i].id] = i;
        }
        for (let i = 0; i < this.teams.length; i++) {
          if (!e[this.teams[i].id]) {
            continue;
          }
          for (let j of e[this.teams[i].id].results) {
            this.resultsTable[arr[j.taskInfo.id]][i] = j.result;
            this.copyResultsTable[arr[j.taskInfo.id]][i] = j.result;
          }
        }
        this.show_table = true;
      });
    },

    async update_element(team_id, task_id, val) {
      let flag = false;
      let res = await fetch(`https://back.is57.ru/results/set?token=${this.token}&team_id=${team_id}&task_id=${task_id}&value=${val}`);
      if (await res.text() === 'invalid token') {
        alert('Неверный токен');
        flag = true;
      }
      let team_ind = -1, task_ind = -1;
      for (let i = 0; i < this.teams.length; i++) {
        if (this.teams[i].id === team_id) {
          team_ind = i;
          break;
        }
      }
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id === task_id) {
          task_ind = i;
          break;
        }
      }
      if (!flag) {
        this.resultsTable[task_ind][team_ind] = val;
        this.copyResultsTable[task_ind][team_ind] = val;
      }
    },
    rebuild(e) {
      let width = this.teams.length;
      let height = this.tasks.length;
      this.resultsTable = new Array(height);
      this.copyResultsTable = new Array(height);
      for (let i = 0; i < height; i++) {
        this.resultsTable[i] = new Array(width);
        this.copyResultsTable[i] = new Array(width);
      }
      let arr = {};
      for (let i = 0; i < this.tasks.length; i++) {
        arr[this.tasks[i].id] = i;
      }
      for (let i = 0; i < this.teams.length; i++) {
        if (!e[this.teams[i].id]) {
          continue;
        }
        for (let j of e[this.teams[i].id].results) {
          this.resultsTable[arr[j.taskInfo.id]][i] = j.result;
          this.copyResultsTable[arr[j.taskInfo.id]][i] = j.result;
        }
      }
    },
  },

  async mounted() {
    if (localStorage['token']) {
      this.token = localStorage['token'];
    }
    this.teams = await this.getTeamList();
    this.tasks = await this.getTaskList();
    this.results = await this.getResultList().then((e) => {
      this.teams.sort((b, a) => {
        return a.building > b.building ? -1 : a.building === b.building ? 0 : 1;
      })
      this.tasks.sort((a, b) => {
        return a.subject < b.subject ? -1 : a.subject === b.subject ? 0 : 1;
      })
      this.rebuild(e);
      this.show_table = true;
    });
  },
}
</script>

<style scoped>
.cont2 * {
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.cont {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.field {
  padding: 10px;
  background: #efefef;
  border-radius: 10px;
  margin: 15px;
}

h1 {
  margin: 10px;
}

input {
  border-radius: 5px;
  border: none;
  padding: 4px;
}

button {
  padding: 4px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  cursor: pointer;
}

.cont2 {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.list {
  margin: 10px;
}

.select {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2px;
  flex-wrap: wrap;
}

.select strong {
  font-size: 12px;
  margin-bottom: 5px;
}

.task-field {
  display: flex;
  flex-direction: column;
}

.table-field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.field2 {
  padding: 10px;
  padding-top: 30px;
  background: #efefef;
  border-radius: 10px;
  margin: 30px;
  max-width: 70%
}

.field2 .cont2 {
  margin-top: 15px;
}

.field2 b {
  font-size: 30px;
}

.field2 select {
  font-size: 15px;
  padding: 2px;
}

.field2 input {
  font-size: 15px;
  padding: 6px;
}

.field2 button {
  font-size: 15px;
}

.field2 .cont2 * {
  margin-bottom: 10px;
}

.cont3 {
  display: flex;
  flex-wrap: wrap;
  margin-top: 70px;
  margin-bottom: 70px;
  text-align: left;
  justify-content: center;
}

.cont3 h1 {
  margin-bottom: 20px;
}

.header {
  font-size: 60px;
  margin: 30px;
}

#vuetable {
  font-size: 20px;
}

.table-res {
  background-color: white;
  font-size: 10px;
}

.table-res::-webkit-scrollbar {
  background-color: white;
  color: #2c3e50;
  width: 5px;
  height: 5px;
}
.table-res::-webkit-scrollbar-track {
  background-color: white;
  color: #2c3e50;
}

.table-res::-webkit-scrollbar-thumb {
  background-color: black;
}

tr {
  height: 20px;
}

th {
  width: 70px !important;
  height: 40px;
}

.item {
  width: 50px;
  margin: 5px;
}

input {
  text-align: center;
  outline: 1px solid black;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type='number'],
input[type="number"]:hover,
input[type="number"]:focus {
  appearance: none;
  -moz-appearance: textfield;
}

#autizm {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 1000;
  font-size: 10px;
}

.field3 {
  width: 60%;
  height: 520px;
}

.scrolly {
  overflow: scroll;
  height: 400px;
  width: 100%;
  background-color: white;
}

.field3 b {
  font-size: 30px;
}

.loading-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 20px;
  color: rgba(44, 62, 80, 0.25);
}

.loading-flex strong {
  font-size: 30px;
}

@media screen and (max-width: 600px){
  .field3 {
    width: 80%;
    height: 380px;
  }
  .scrolly {
    height: 250px;
  }
}

</style>