exports.verifySignIn = (req, res) => {
    if (
      req &&
      req.body &&
      req.body.mobile &&
      VALIDATION.isMobileValid(req.body.mobile) &&
      req.body.otp &&
      VALIDATION.isOTPValid(req.body.otp)
    ) {
      //Check OTP is valid
  
      var mobile = req.body.mobile;
      var searchQuery = { user_mobile: mobile };
      //find and update the user
      User.findOne(searchQuery, function (err, user) {
        if (err || user === null) {
          console.log("Sign In: Find User: " + err);
          return res.status(500).json(ERROR_CODES.USER_SAVE_VERIFY_ERROR);
        }
  
        //Verify OTP
        Login.findOne({ user_mobile: req.body.mobile }, (err, loginUser) => {
          if (err || null === loginUser) {
            return res.status(500).json({
              message: "Login failed due to technical error. Please try again.",
            });
          }
  
          if (
            loginUser &&
            loginUser.user_code &&
            loginUser.user_code === req.body.otp
          ) {
            loginUser.user_code = ''
            Login.updateOne(
              { user_mobile: req.body.mobile },
              loginUser,
              function (err, log) {
                if (err) {
                  res
                    .status(500)
                    .json({ message: "Error updaing code in login table." });
                }
                var token = jwt.sign({ u_mobile: user.user_mobile }, config.secret, {
                  expiresIn: 28800000, // 8 hours
                });
      
                return res.status(200).json({
                  message: "Login successful",
                  token: token,
                  user: {
                    userId: user.user_id,
                    userEmail: user.user_email,
                    userMobile: user.user_mobile,
                    userCountry: user.user_country,
                  },
                });
              }
            );
  
          
          } else {
            return res.status(500).json({
              message: "You have entered incorrect OTP, please try again.",
            });
          }
        });
      });
    } else {
      return res.status(500).json(ERROR_CODES.VERIFICATION_FAILUTE);
    }
  };