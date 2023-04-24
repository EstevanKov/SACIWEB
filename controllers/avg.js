exports.index = async (req, res) => {
    try {
        const db = dbo.getDb()
        const collection = await db.collection("logs")
        const aggregations = (sensor) => {
            return collection.aggregate([
                { $match: { id: sensor } },
                { $sort: { date: 1, hour: 1 } },
                { $project: { _id: 0 } }
            ]).limit(1).toArray()
        }
        const phsensors = [
            "ph_suelo_s1",
            "ph_suelo_s2",
        ]
        const watersensors = [
            "temperatura_suelo_s1",
            "temperatura_suelo_s2",
            "temperatura_suelo_s3",
        ]
        const humiditysensors = [
            "humedad_suelo_s1",
            "humedad_suelo_s2",
            "humedad_suelo_s3",
        ]
        const ph = await Promise.all(phsensors.map(aggregations))
        const water = await Promise.all(watersensors.map(aggregations))
        const humidity = await Promise.all(humiditysensors.map(aggregations))
        const result = {
            ph: ph,
            water: water,
            humidity: humidity
        }
        return res.status(200).json(result)
    } catch (err){

    }
}