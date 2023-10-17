export const generate_activation_code = () => {
    let activation_code = Math.floor(Math.random() * 9);
    while (activation_code == 0) {
        activation_code = Math.floor(Math.random() * 9);
    }
    for (let i = 1; i <= 5; i++) {
        activation_code = (activation_code * 10) + Math.floor(Math.random() * 9);
    }
    return activation_code;
};
