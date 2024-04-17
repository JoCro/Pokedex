
function drawChart(){
    const ctx = document.getElementById(`myChart`);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: statNames,
      datasets: [{
        label: 'Stats',
        data: statvalues,
        borderWidth: 1,
        barThickness: 10,
        backgroundColor: ['green','red']
        
      }]
    },
    options: {

        maintainAspectRatio: false,
        indexAxis: 'y',
        
        
      scales: {

        x:{
            grid: {
                offset: true
            }
        },
        y: {
          beginAtZero: true,
          grid: {
            offset: true
          }
        }
      }
    }
  });
}
