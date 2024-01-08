module.exports = function make_calc_sum() {
  return async function calc_sum(this: any, msg: any) {
    const seneca = this

    let sum = msg.lhs + msg.rhs

    return { ok: true, sum }
  }
}
