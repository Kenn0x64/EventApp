const fileSchmea =
{
    fileName: {
        type: String,
        unique: true,
        required: ['true', 'Invaild File Name']
    },
    url: {
        type: String,
        unique: true,
        required: ['true', 'Invaild URL']
    },
}


module.exports = fileSchmea;
