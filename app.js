(function(){
	var Contact = Backbone.Model.extend({
		defaults: {
			name: "",
			note: "",
			favorite: false,
			online: false
		}
	});

	var Contacts = Backbone.Collection.extend({
		model: Contact
	});

	var ContactDetails = Backbone.View.extend({
		events: {
			"change #name": "nameChange"
		},

		template: _.template(
			"<label for='name'>Name</label><input id='name' placeholder='Name' value='<%= name %>'/>" +
			"<label for='note'>Note</label><textarea id='note' placeholder='Note'><%= note %></textarea>"
			),

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		nameChange: function(e){
			this.model.set("name", $(e.target).val());
		},

		editContact: function(contact){
			this.model = contact;
			this.render();
		}
	});

	var ContactsList = Backbone.View.extend({
		tagName: "ul",
	
		template: "<a class='add'>+ Add another contact</a>",

		events: {
			"click .add": "addContact"
		},

		initialize: function(){
			this.model.bind("add", this.renderOne, this);
		},

		render: function(){
			var el = this.$el;
			el.html(this.template);
			this.model.forEach(this.renderOne, this);
			return this;
		},

		renderOne: function(contact){
			var view = new ContactsListItem({ model: contact });
			view.render().$el.appendTo(this.el);
		},

		addContact: function(e){
			var contact = new Contact;
			contacts.add(contact);
			contactDetails.editContact(contact);
			e.preventDefault();
		}
	});

	var ContactsListItem = Backbone.View.extend({
		initialize: function(){
			this.model.bind("change:name", this.nameChanged, this);
		},

		events: {
			"click": "editContact"
		},

		tagName: "li",

		template: _.template("<span class='name'><%= name %></span><span class='favorite'></span>"),

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		nameChanged: function(){
			this.$el.find(".name").text(this.model.get("name"));
		},

		editContact: function(e){
			e.preventDefault();
			contactDetails.editContact(this.model);	
		}
	});

	var contacts = new Contacts([{ name: "Adam" }, { name: "Stan", note: "Haven't met him in person yet" }, { name: "Idris" }, { name: "Andrew"} ]);

	var contactsList, contactDetails;

	$(function(){
		contactsList = new ContactsList({ el: $("#contactsList"), model: contacts });
		contactsList.render();
		contactDetails = new ContactDetails({el: $("#contactDetails"), model: contacts.at(0) });
		contactDetails.render();
	});
	
})();
