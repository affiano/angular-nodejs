const db = require("../startup/db")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { VendorMaster, VendorAddress, VendorNeftDetails, City, State,Country
} = require('../schema/dbSchema');
const vendor = require("../models/vendor");
"use strict";

class UserController {

    async findVendorNeftDetailsById(vendorId) {
        const vendorNeftDetails = await VendorNeftDetails.findOne({
            where: {
                vendorId: vendorId,
            }
        });
        return vendorNeftDetails;
    }

    async saveVendor(data, userId) {
        let vendortrans;
        try {
            // get transaction
            vendortrans = await db.transaction();
            const vendor = new VendorMaster((data));
            const vendorAddressList = data.vendorAddress;
            var vendorNeft = new VendorNeftDetails(data.vendorNeft);
            vendor.isActive = 0;
            vendor.createdBy = userId;
            vendor.createdOn = new Date();
            await vendor.save({ transaction: vendortrans });
            vendorAddressList.forEach(x => {
                x.vendorId = vendor.id;
                x.id = null;
                x.isActive = true;
                x.createdBy = userId
                x.createdOn = new Date();
            });
            vendorNeft.vendorId = vendor.id;
            vendorNeft.createdBy = userId;
            vendorNeft.createdOn = new Date();
            await VendorAddress.bulkCreate(vendorAddressList, { transaction: vendortrans });
            await vendorNeft.save({ transaction: vendortrans });
            vendortrans.commit();
            return vendor;
        } catch (err) {
            vendortrans.rollback();
        }
    }
}

module.exports = UserController;