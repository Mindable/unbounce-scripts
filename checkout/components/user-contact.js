app.component('user-contact',{
  props: {
    user: {
      type: Object,
      required: true,
    },
    userIdentified : {
      type: Boolean,
      default: false,
    }
  },
  template: `
    <div>
      <label>First Name: *</label>
      <input type="text" v-model.trim="user.firstname">
    </div>
    <div>
      <label>Last Name: *</label>
      <input type="text" v-model.trim="user.lastname">
    </div>
    <div>
      <label>Email: *</label>
      <input type="email" :disabled="userIdentified" v-model.trim="user.email">
    </div>
    <div>
      <label>Phone Number:</label>
      <input type="text" v-model.trim="user.phone">
    </div>`
});
