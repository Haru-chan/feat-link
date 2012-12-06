/**
 * Represents an icon for a project or some other entity in JIRA.
 *
 * @Class JIRA.Avatar
 *
 */
JIRA.Avatar = Class.extend({

    /**
     * @constructor
     * @param options
     * ... {Number} id
     * ... {Boolean} isSystemAvatar
     */
    init: function (options) {
        this._id = options.id;
        this._isSystemAvatar = options.isSystemAvatar;
        this._isSelected = options.isSelected;
    },

    /**
     * Sets as unselected
     */
    setUnSelected: function () {
        this._isSelected = false;
    },

    /**
     * Sets as selected
     */
    setSelected: function () {
        this._isSelected = true;
    },

    /**
     * Gets selected state
     */
    isSelected: function () {
        return !!this._isSelected;
    },

    /**
     * Indicates whether the Avatar is a system-provided one or if users have defined it.
     *
     * @return {Boolean} true only if the Avatar is a system-provided one.
     */
    isSystemAvatar: function () {
        return this._isSystemAvatar;
    },

    /**
     * The database identifier for the Avatar, may be null if it hasn't yet been stored.
     *
     * @return the database id or null.
     */
    getId: function () {
        return this._id;
    },

    /**
     * Serilaizes the object into a JSON object
     *
     * @return {Object}
     */
    toJSON: function () {
        return {
            id: this._id,
            isSystemAvatar: this._isSystemAvatar,
            isSelected: this._isSelected
        }
    }
});


// Factories

/**
 * Creates custom avatar
 *
 * @param descriptor
 * ... {String} id
 */
JIRA.Avatar.createCustomAvatar = function (descriptor) {
    descriptor.isSystemAvatar = false;
    return new JIRA.Avatar(descriptor);
};

/**
 * Creates system avatar
 *
 * @param descriptor
 * ... {String} id
 */
JIRA.Avatar.createSystemAvatar = function (descriptor) {
    descriptor.isSystemAvatar = true;
    return new JIRA.Avatar(descriptor);
};


// Sizes

/**
 * Large avatar settings
 */
JIRA.Avatar.LARGE = {
    param: "large",
    height: 48,
    width: 48
};

/**
 * Medium avatar settings
 */
JIRA.Avatar.MEDIUM = {
    param: "medium",
    width: 32,
    height: 32
};

/**
 * Small avatar settings
 */
JIRA.Avatar.SMALL = {
    param: "small",
    width: 16,
    height: 16
};

