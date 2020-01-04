import _ from "lodash";

const createSound = _.memoize(asset => new Audio(asset));

const sys = {
  play: (asset, { cache = true, debounce = false } = {}) => {
    const audio =  new Audio(asset);

    audio.play();
  }
}

const AudioSystem = (Wrapped = x => x) => (entities, args) => {

  if (!args.audio)
      args.audio = sys;

  return Wrapped(entities, args);
};

export default AudioSystem;