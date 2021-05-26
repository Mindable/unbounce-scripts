app.component('user-contact',{
  props: {
    user: {
      type: Object,
      required: true,
    }
  },
  template: `
    <div>
      <label>First Name: *</label><br>
      <input type="text" v-model.trim="user.firstname">
    </div>
    <div>
      <label>Last Name: *</label><br>
      <input type="text" v-model.trim="user.lastname">
    </div>
    <div>
      <label>Email ID: *</label><br>
      <input type="email" disabled v-model.trim="user.email">
    </div>
    <div>
      <label>Phone Number:</label><br>
      <input type="number" v-model.trim="user.phone">
    </div>`
});
