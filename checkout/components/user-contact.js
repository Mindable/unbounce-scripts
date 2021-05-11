app.component('user-contact',{
  props: {
    user: {
      type: Object,
      required: true,
    }
  },
  template: `<h3>Contact Information</h3>
    <div>
        <label>First Name: *</label><br>
        <input type="text" v-model="user.firstname">
    </div>
    <div>
        <label>Last Name: *</label><br>
        <input type="text" v-model="user.lastname">
    </div>
    <div>
        <label>Email ID: *</label><br>
        <input type="email" disabled v-model="user.email">
    </div>
    <div>
        <label>Phone Number:</label><br>
        <input type="text" v-model="user.phone">
    </div>`
});
