def plot_bowling_action(data):
    import matplotlib.pyplot as plt

    # Example visualization: Plotting bowling speed over time
    plt.figure(figsize=(10, 5))
    plt.plot(data['time'], data['speed'], label='Bowling Speed', color='blue')
    plt.title('Bowling Speed Over Time')
    plt.xlabel('Time (s)')
    plt.ylabel('Speed (km/h)')
    plt.legend()
    plt.grid()
    plt.show()

def plot_bowling_angles(data):
    import seaborn as sns

    # Example visualization: Distribution of bowling angles
    plt.figure(figsize=(10, 5))
    sns.histplot(data['angle'], bins=30, kde=True, color='orange')
    plt.title('Distribution of Bowling Angles')
    plt.xlabel('Angle (degrees)')
    plt.ylabel('Frequency')
    plt.grid()
    plt.show()