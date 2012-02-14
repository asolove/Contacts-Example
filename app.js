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
		}
	});

	var ContactsList = Backbone.View.extend({
		tagName: "ul",

		render: function(){
			var el = this.$el;
			el.empty();
			this.model.forEach(function(contact){
				var view = new ContactsListItem({ model: contact });
				view.render().$el.appendTo(el);
			});
			return this;
		}
	});

	var ContactsListItem = Backbone.View.extend({
		initialize: function(){
			this.model.bind("change:name", this.nameChanged, this);
		},

		tagName: "li",

		template: _.template("<span class='name'><%= name %></span><span class='favorite'></span>"),

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		nameChanged: function(){
			this.$el.find(".name").text(this.model.get("name"));
		}
	});

	var contacts = new Contacts([{ name: "Adam" }, { name: "Stan" }]);

	$(function(){
		var contactsList = new ContactsList({ el: $("#contactsList"), model: contacts });
		contactsList.render();
		var contactDetails = new ContactDetails({el: $("#contactDetails"), model: contacts.at(0) });
		contactDetails.render();
	});
	
})();
