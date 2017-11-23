import Center from '../models/center-model';
import store from '../config/mockDB';


const getBool = (str) => {
  if (str === 'true') {
    return true;
  }
  if (str === 'false') {
    return false;
  }
  return false;
};

/**
 *
 */
export default class CenterController {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {json} returns created center
   */
  static create(req, res) {
    if (!req.body.name) return res.status(400).send('canter name is required');
    if (!req.body.state) return res.status(400).send('state name is required');
    if (!req.body.address) return res.status(400).send('address is required');
    if (!req.body.hasProjectors) return res.status(400).send('hasProjectors is required');
    if (!req.body.hallCapacity) return res.status(400).send(' hallCapacity is required');
    if (!req.body.carParkCapacity) return res.status(400).send('carParkCapacity name is required');

    const newId = store.centers.length + 1;
    const newCenter = new Center(
      newId,
      req.body.name,
      req.body.state,
      req.body.address,
      getBool(req.body.hasProjectors),
      Number(req.body.hallCapacity),
      Number(req.body.carParkCapacity)
    );
    store.centers.push(newCenter);
    res.status(201).json(newCenter);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {json} returns a list of all centers
   */
  static getAll(req, res) {
    return res.status(200).json(store.centers);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {json} returns a single center by id
   */
  static get(req, res) {
    const singleCenter = store.centers.find(center => center.id === Number(req.params.centerId));
    return res.status(200).json(singleCenter);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {json} returns the updated center object
   */
  static update(req, res) {
    const singleCenter = store.centers.find(center => center.id === Number(req.params.centerId));
    if (singleCenter === null || singleCenter === undefined) {
      return res.status(404).json({ message: 'Center doesnot exist' });
    }
    singleCenter.name = req.body.name;
    singleCenter.address = req.body.address;
    singleCenter.hasProjectors = getBool(req.body.hasProjectors);
    singleCenter.hallCapacity = Number(req.body.hallCapacity);
    singleCenter.carParkCapacity = Number(req.body.carParkCapacity);
    singleCenter.state = req.body.state;

    const pos = store.centers.map(event => event.id).indexOf(singleCenter.id);
    store.centers[pos] = singleCenter;
    return res.status(200).json(store.centers[pos]);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {json} returns message object
   */
  static delete(req, res) {
    const singleCenter = store.centers.find(center => center.id === Number(req.params.centerId));
    if (singleCenter === null || singleCenter === undefined) {
      return res.status(404).json({ message: 'Center doesnot exist' });
    }
    const centerPos = store.centers.map(center => center.id).indexOf(req.params.centerId);
    store.centers.splice(centerPos, 1);
    res.status(200).json({ message: 'Center was successfully deleted' });
  }
}