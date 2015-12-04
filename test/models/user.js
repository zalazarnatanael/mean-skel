var utils = require('../utils'),
    expect = require('chai').expect,
    User = require('../../app/models/user');

describe('User', function () {

  describe('Valid User', function () {
    var validUser = null;
    var password = "12345678";

    // Create a user and store it in validUser object
    before(function(done){
      var userData = {
        email: "test@test.com",
        password: password,
        firstname: "John",
        lastname: "Doe"
      };

      User.create(userData, function (error, user) {
        if (!error)
          validUser = user;
        else
          throw error;

        done();
      });
    })

    it('saves password in an encrypted hash', function (done) {
    	expect(validUser.password).to.not.equal(null);
    	expect(validUser.password).to.not.equal(password);
    	expect(validUser.comparePassword(password)).to.equal(true);
    	done();
    });

    it('generates an activation token automatically', function (done) {
      expect(validUser.activation_token).to.not.equal(null);
      done();
    });

    it('is not active by default', function (done) {
      expect(validUser.active).to.equal(false);
      done();
    });

    it('activates their account', function (done) {
      User.activateAccount(validUser.activation_token, function(err, user){
        expect(user.active).to.equal(true);
        done();
      });
    });

  });

  describe('Invalid User', function () {

    it('is invalid with a taken email', function (done) {
    	var validUser = {
      	email: "test@test.com",
       	password: "12345678"
     	};

     	var invalidUser = {
      	email: "test@test.com", // taken email
       	password: "12345678"
     	};

     	User.create(validUser, function (error, user) {
      	// Create second user with same email
      	User.create(invalidUser, function (error, user) {
      		expect(error).to.not.equal(null);
      		done();
  	   	});
     	});
    });

    it('is invalid with an invalid email', function (done) {
     	var user = {
      	email: "test", // invalid email
       	password: "12345678"
     	};

     	User.create(user, function (error, user) {
      	expect(error).to.not.equal(null);
      	email_error = error.errors.email;
      	expect(email_error.message).to.equal("Please fill a valid email address.");
      	done();
     	});
    });

    it('is invalid without firstname', function (done) {
      var user = {
        email: "nofirstname@test.com",
        password: "12345678"
      };

      User.create(user, function (error, user) {
        expect(error).to.not.equal(null);
        firstname_error = error.errors.firstname;
        expect(firstname_error.message).to.equal("Firstname is required.");
        done();
      });
    });

    it('is invalid without lastname', function (done) {
      var user = {
        email: "nolastname@test.com",
        password: "12345678"
      };

      User.create(user, function (error, user) {
        expect(error).to.not.equal(null);
        lastname_error = error.errors.lastname;
        expect(lastname_error.message).to.equal("Lastname is required.");
        done();
      });
    });

    it('is invalid with a password length less than 8 characters', function (done) {
     	var user = {
      	email: "invalidapassword@test.com",
       	password: "1234567"
     	};

     	User.create(user, function (error, user) {
      	expect(error).to.not.equal(null);
      	password_error = error.errors.password;
      	expect(password_error.message).to.equal("Password is too short.");
      	done();
     	});
    });

  })

});
