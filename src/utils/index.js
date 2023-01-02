const mapDBToModel = ({
    id,
    title, 
    year,
    genre,
    performer,
    duration,
    album_id,
}) => ({
    id,
    title,
    year, 
    performer,
    genre,
    duration,
    albumId: album_id,
});

const mapDBToModelAll = ({
    id,
    title, 
    performer,
}) => ({
    id,
    title,
    performer,
})

module.exports = { mapDBToModel, mapDBToModelAll };