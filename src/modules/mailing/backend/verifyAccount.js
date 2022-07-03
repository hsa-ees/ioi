const { default: Account } = require("../../mongoDB/schemes/account");

exports.verifyAccount = async (req, res, next) => {
	await Account.findOne({
	  confirmationCode: req.params.confirmationCode,
	})
	  .then((account) => {
		if (!account) {
		  return res.status(404).send("Account nicht gefunden");
		}
  
		account.status = "Active";
		account.save((err) => {
		  if (err) {
			res.status(500).send({ message: err });
			return;
		  }
		})
	  })
	  .catch((e) => console.log("error", e));
	res.redirect('/')
  };